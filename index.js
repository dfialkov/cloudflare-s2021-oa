const Router = require('./router')

/**
 * Example of how router can be used in an application
 *  */
addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event.request))
})

const links = {
    Google: 'https://google.com',
    Facebook: 'https://facebook.com',
    Amazon: 'https://amazon.com',
}

function handler(request) {
    const init = {
        headers: { 'content-type': 'application/json' },
    }
    const body = JSON.stringify({ some: 'json' })
    return new Response(body, init)
}

const avatarLink = "https://media-exp1.licdn.com/dms/image/C4E03AQGbna9zzAP-fw/profile-displayphoto-shrink_200_200/0?e=1608163200&v=beta&t=Auw4rM7xqs70xu8uslCM4SLZ1MUi9duBBroG-slsP6E"

const socialLinks = {LinkedIn : "https://www.linkedin.com/in/dfialkov/", Github :"https://github.com/dfialkov/"};

const rewriter = new HTMLRewriter()
  .on('div#links', new LinkRewriter(links))
  .on('img#avatar', new AvatarRewriter(avatarLink))
  .on("div#profile", new ProfileRewriter)
  .on('h1#name', new NameRewriter)
  .on('div#social', new SocialRewriter)
  .on('body', new BackgroundRewriter)
  .on('title', new TitleRewriter)

//Of the options available, creting a new class for each type of rewrite operation seems preferable to a single large rewriter with giant if statements
class TitleRewriter{
    element(element){
        element.setInnerContent("Daniel Fialkov")
    }
}

  class BackgroundRewriter{
    element(element){
        element.setAttribute("class", "bg-indigo-400")
    }
  }
  class SocialRewriter{
    
    element(element){
        element.removeAttribute("style")
        element.prepend("<a href = https://www.linkedin.com/in/dfialkov/><img height=\"32\" width=\"32\" src=\"https://unpkg.com/simple-icons@v3/icons/linkedin.svg\" /></a>", {html:true});
        element.prepend("<a href = https://github.com/dfialkov/><img height=\"32\" width=\"32\" src=\"https://unpkg.com/simple-icons@v3/icons/github.svg\" /></a>", {html:true});
    }
}

  class NameRewriter{
    element(element){
        element.prepend("Daniel Fialkov")
    }
}

class ProfileRewriter{
    element(element){
        element.removeAttribute("style")
    }
}

class AvatarRewriter {
    constructor(avatarLink) {
        this.linkField = avatarLink;
      }

element(element) {
element.removeAttribute("style");
element.setAttribute("src", avatarLink);

}
}


class LinkRewriter {
    constructor(links) {
        this.linkField = links;
      }


element(element) {
    for(const site in this.linkField){
    var elemString = "<a href = " +  this.linkField[site] + ">" + site + "</a>";
    element.prepend(elemString, {html:true});
    }
}
}

async function handleRequest(request) {
    const r = new Router()
    //get links
    r.get('/links', () => new Response(JSON.stringify(links)))
    //match everything
    r.get('.*', () => {
        return fetch('https://static-links-page.signalnerve.workers.dev').then(page => rewriter.transform(page));
        
    }) // return a default message for the root route

    const resp = await r.route(request)
    return resp
}
