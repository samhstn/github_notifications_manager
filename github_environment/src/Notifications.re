open Webapi.Dom;

let qs = (s) =>
  document
  |> Document.querySelector(s)
  |> Js.Option.getExn

type notification = {
  href: string,
  markAsReadUrl: string,
  name: string,
}

let notification = n => {
  href: n |> Json.Decode.field("href", Json.Decode.string),
  markAsReadUrl: n |> Json.Decode.field("markAsReadUrl", Json.Decode.string),
  name: n |> Json.Decode.field("name", Json.Decode.string),
}

type repo = {
  repoHref: string,
  repoName: string,
  repoNotifications: array(notification),
}

let repo = r => {
  repoHref: r |> Json.Decode.field("repoHref", Json.Decode.string),
  repoName: r |> Json.Decode.field("repoName", Json.Decode.string),
  repoNotifications: r |> Json.Decode.field("repoNotifications", Json.Decode.array(notification))
}

let repoMap = ({repoHref, repoName, repoNotifications}) => {
  {j|
    <div class="boxed-group">
      <a class="notifications-repo-link" href="$repoHref">$repoName</a>
      <ul class="notifications">
  |j}
  ++
  (repoNotifications
  |> Array.map(({href, markAsReadUrl, name}) => {
    {j|
      <li class="list-group-item">
        <a class="list-group-item-link" href="$href">$name</a>
        <ul class="notification-actions">
          <li class="delete">
            <div class="js-delete-notification" id="$markAsReadUrl" method="post">
              <button type="submit">Mark as read</button>
            </div>
          </li>
        </ul>
      </li>
    |j}
  })
  |> Js.Array.joinWith(""))
  ++
  {|
      </ul>
    </div>
  |}
}

let addListeners = () => {
  document
    |> Document.querySelectorAll(".js-delete-notification")
    |> NodeList.toArray
    |> Array.iter((node) => {
      let deleteUrl =
        node
        |> Element.ofNode
        |> Js.Option.getExn
        |> Element.id

      node
      |> Element.ofNode
      |> Js.Option.getExn
      |> Element.querySelector("button")
      |> Js.Option.getExn
      |> Element.addClickEventListener((_e) => {
        let _ = Js.Promise.(
          Fetch.fetchWithInit(
            deleteUrl,
            Fetch.RequestInit.make(~method_=Post, ()),
          )
          |> then_(Fetch.Response.text)
          |> then_((json) => {
            Js.log("fetched " ++ json);

            resolve();
          })
        );
      })
    })

  qs("#reset-notifications")
    |> Element.addClickEventListener((_e) => {
      let _ = Js.Promise.(
        Fetch.fetchWithInit(
          "/api/notifications",
          Fetch.RequestInit.make(~method_=Post, ()),
        )
        |> then_(Fetch.Response.text)
        |> then_((_) => {
          Js.log("reset notifications");

          resolve();
        })
      );
    })
}

Js.Promise.(
  Fetch.fetch("/api/notifications")
  |> then_(Fetch.Response.text)
  |> then_((json) => {
    let reposList = Json.parseOrRaise(json)
      |> Json.Decode.array(repo)
      |> Array.map(repoMap)
      |> Js.Array.joinWith("")

    let html = {j|
      <div class="notifications-list">
        $reposList
      </div>
    |j}

    qs("#app")
      -> Element.setInnerHTML(html)

    addListeners();

    resolve();
  })
);
