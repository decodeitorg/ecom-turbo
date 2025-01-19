const successAlert = (message) => {
    const code = `
       <div class="toast active">
          <div class="toast-content">
             <svg height='56px' width='56px' viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#4CAF50"></path><path d="M738.133333 311.466667L448 601.6l-119.466667-119.466667-59.733333 59.733334 179.2 179.2 349.866667-349.866667z" fill="#CCFF90"></path></g></svg>
          <div class="message">
             <span class="text text-1">Success</span>
             <span class="text text-2">${message}</span>
          </div>
          </div>
          <i class="fa-solid fa-xmark close">x</i>
          <div class="progress active"></div>
       </div>
    `;

    const body = document.body;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = code;
    body.insertAdjacentElement("afterbegin", wrapper);

    const toast = document.querySelector(".toast");
    const closeIcon = document.querySelector(".close");
    const progress = document.querySelector(".progress");

    let toastTimer = setTimeout(() => {
        toast.classList.remove("active");
        progress.classList.remove("active");
    }, 3000);

    closeIcon.addEventListener("click", () => {
        toast.classList.remove("active");
        progress.classList.remove("active");
        clearTimeout(toastTimer);
    });
};
export const errorAlert = (message) => {
    const code = `
       <div class="toast active">
          <div class="toast-content">
       <svg
          height='56px' width='56px'
          xmlns:osb="http://www.openswatchbook.org/uri/2009/osb"
          xmlns:dc="http://purl.org/dc/elements/1.1/"
          xmlns:cc="http://creativecommons.org/ns#"
          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          xmlns:svg="http://www.w3.org/2000/svg"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
          viewBox="0 0 48 48"
          version="1.1"
          id="svg15"
          sodipodi:docname="cross red circle.svg"
          inkscape:version="0.92.3 (2405546, 2018-03-11)">
       <metadata
          id="metadata19">
          <rdf:RDF>
             <cc:Work
                rdf:about="">
             <dc:format>image/svg+xml</dc:format>
             <dc:type
                rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
             <dc:title />
             </cc:Work>
          </rdf:RDF>
       </metadata>
       <sodipodi:namedview
          pagecolor="#ffffff"
          bordercolor="#666666"
          borderopacity="1"
          objecttolerance="10"
          gridtolerance="10"
          guidetolerance="10"
          inkscape:pageopacity="0"
          inkscape:pageshadow="2"
          inkscape:window-width="1920"
          inkscape:window-height="1027"
          id="namedview17"
          showgrid="false"
          inkscape:zoom="4.9166667"
          inkscape:cx="-11.694915"
          inkscape:cy="40.271186"
          inkscape:window-x="-8"
          inkscape:window-y="-8"
          inkscape:window-maximized="1"
          inkscape:current-layer="g13" />
       <defs
          id="defs7">
          <linearGradient
             id="linearGradient828"
             osb:paint="solid">
             <stop
                style="stop-color:#ff0000;stop-opacity:1;"
                offset="0"
                id="stop826" />
          </linearGradient>
          <linearGradient
             id="0"
             gradientUnits="userSpaceOnUse"
             y1="47.37"
             x2="0"
             y2="-1.429">
             <stop
                stop-color="#c52828"
                id="stop2" />
             <stop
                offset="1"
                stop-color="#ff5454"
                id="stop4" />
          </linearGradient>
       </defs>
       <g
          transform="matrix(.99999 0 0 .99999-58.37.882)"
          enable-background="new"
          id="g13"
          style="fill-opacity:1">
          <circle
             cx="82.37"
             cy="23.12"
             r="24"
             fill="url(#0)"
             id="circle9"
             style="fill-opacity:1;fill:#dd3333" />
          <path
             d="m87.77 23.725l5.939-5.939c.377-.372.566-.835.566-1.373 0-.54-.189-.997-.566-1.374l-2.747-2.747c-.377-.372-.835-.564-1.373-.564-.539 0-.997.186-1.374.564l-5.939 5.939-5.939-5.939c-.377-.372-.835-.564-1.374-.564-.539 0-.997.186-1.374.564l-2.748 2.747c-.377.378-.566.835-.566 1.374 0 .54.188.997.566 1.373l5.939 5.939-5.939 5.94c-.377.372-.566.835-.566 1.373 0 .54.188.997.566 1.373l2.748 2.747c.377.378.835.564 1.374.564.539 0 .997-.186 1.374-.564l5.939-5.939 5.94 5.939c.377.378.835.564 1.374.564.539 0 .997-.186 1.373-.564l2.747-2.747c.377-.372.566-.835.566-1.373 0-.54-.188-.997-.566-1.373l-5.939-5.94"
             fill="#fff"
             fill-opacity=".842"
             id="path11"
             style="fill-opacity:1;fill:#ffffff" />
       </g>
       </svg>        
             <div class="message">
             <span class="text text-1">Error</span>
             <span class="text text-2">${message}</span>
          </div>
          </div>
          <i class="fa-solid fa-xmark close">x</i>
          <div class="progress active bg-red"></div>
       </div>
    `;

    const body = document.body;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = code;
    body.insertAdjacentElement("afterbegin", wrapper);

    const button = document.querySelector("button");
    const toast = document.querySelector(".toast");
    const closeIcon = document.querySelector(".close");
    const progress = document.querySelector(".progress");

    let toastTimer = setTimeout(() => {
        toast.classList.remove("active");
        progress.classList.remove("active");
    }, 3000);

    closeIcon.addEventListener("click", () => {
        toast.classList.remove("active");
        progress.classList.remove("active");
        clearTimeout(toastTimer);
    });
};
