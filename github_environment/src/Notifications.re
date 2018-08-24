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

type repo = {
  repoHref: string,
  repoName: string,
  repoNotifications: array(notification),
}

module Decode = {
  open Json.Decode;

  let notification = n => {
    href: n |> field("href", string),
    markAsReadUrl: n |> field("markAsReadUrl", string),
    name: n |> field("name", string),
  }


  let repo = r => {
    repoHref: r |> field("repoHref", string),
    repoName: r |> field("repoName", string),
    repoNotifications: r |> field("repoNotifications", array(notification))
  }
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
      |> Json.Decode.array(Decode.repo)
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
