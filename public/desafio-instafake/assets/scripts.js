const form = document.querySelector("form");
const baseUrl = "http://localhost:3000/api";
const [botonprev, botonnext] = document.querySelectorAll(".botonfotos")
const login = document.querySelector("nav a")

login.addEventListener("click", () => {
    $("form").show()
    $("nav a").hide()
    $(".botonfotos").hide()
    localStorage.removeItem("pagina")
    localStorage.removeItem("token")
    let contenedorImagenes = document.querySelector("#containerImagenes")
    contenedorImagenes.innerHTML = ""
})

botonprev.addEventListener("click", async() => {
    let pagina = localStorage.getItem("pagina")
    if (pagina > 1) {
        let jwt = localStorage.getItem("token")
        if (jwt) {
            pagina -= 1
            const response = await fetch(`${baseUrl}/photos?page=${pagina}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${jwt}`
                },
            });
            const data = await response.json()
            showDatos(data)
            localStorage.setItem("pagina", pagina)
        }
    }
})

botonnext.addEventListener("click", async() => {
    let pagina = JSON.parse(localStorage.getItem("pagina"))
    let jwt = localStorage.getItem("token")
    pagina += 1
    if (jwt) {
        const response = await fetch(`${baseUrl}/photos?page=${pagina}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${jwt}`
            },
        });
        const data = await response.json()
        showDatos(data)
        localStorage.setItem("pagina", JSON.stringify(pagina))
    }

})



form.addEventListener("submit", async(e) => {
    e.preventDefault();
    const [email, password] = [...document.querySelectorAll("input")].map(
        (i) => i.value
    );
    const userCredentials = {
        email,
        password
    };

    const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        body: JSON.stringify(userCredentials)
    });
    const data = await response.json();
    const token = data.token;
    localStorage.setItem("token", token)
    localStorage.setItem("pagina", "1")
    getPosts()
});


const getPosts = async() => {
    try {
        let jwt = localStorage.getItem("token")
        let pagina = localStorage.getItem("pagina")
        if (jwt && pagina > 1) {
            const response = await fetch(`${baseUrl}/photos?page=${pagina}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${jwt}`
                },
            });
            const data = await response.json()
            $("nav a").removeClass("fade")
            $(".botonfotos").removeClass("fade")
            showDatos(data)
        } else if (jwt) {
            const response = await fetch(`${baseUrl}/photos`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${jwt}`
                },
            });
            const data = await response.json()
            $("nav a").removeClass("fade")
            $(".botonfotos").removeClass("fade")
            showDatos(data)
        } else {
            throw new Error("se requiere Token")
        }

    } catch (err) {
        console.log(err);
    }
};


const showDatos = async(datos) => {
    $(".botonfotos").show()
    $("nav a").show()
    $("form").hide();
    let { data } = datos
    let contenedorImagenes = document.querySelector("#containerImagenes")
    contenedorImagenes.innerHTML = ""
        // voy a limitar las imagenes por la cantidad ya que vienen 100 ocupare 10
    let dataImagenes = data.slice(0, 9)
    dataImagenes.forEach((imagen) => {
        contenedorImagenes.innerHTML += `<img class="mb-2 col-3-md"  style="height:280px; width:320px " src=${imagen.download_url}></img>`
    })

}


getPosts()