const input = document.getElementById("input_file"),
  preview = document.getElementById("preview_div"),
  font_size = document.getElementById("font_size"),
  text_input = document.getElementById("text"),
  apply = document.getElementById("apply"),
  canvas = document.createElement("canvas"),
  img = document.getElementsByTagName("img")[0],
  fileReader = new FileReader();

var dimension, //wymiary obrazka
  photo,
  margin,
  line_spacing = 5;

input.addEventListener("change", handleAddedFile);
apply.addEventListener("click", addTextToPhoto);

function getImageSize(file) {
  return new Promise((resolve, reject) => {
    photo = document.createElement("img");
    photo.onload = () => resolve({ width: photo.width, height: photo.height });
    photo.onerror = () => reject("Nie udało się załadować fotki");
    photo.src = URL.createObjectURL(file);
  });
}

async function handleAddedFile() {
  preview.classList.add("loading");
  const { files } = input;
  if (files.length === 0) return console.log("Nie ma plików...");
  console.log("Pliki:", files);

  input.parentElement.style.display = "none";
  preview.classList.remove("hide");

  console.log(files);
  dimension = await getImageSize(files[0]).catch(console.error);

  font_size.value = Math.round(dimension.width / 25);
  margin = Math.round(dimension.width / 35);
  addTextToPhoto();
}

async function addTextToPhoto() {
  preview.classList.add("loading");
  console.log(preview);
  img.classList.add("hide");
  img.onload = () => {
    preview.classList.remove("loading");
    img.classList.remove("hide");
    // alert("Photo ");
  };

  let line_height = parseInt(font_size.value) + line_spacing;
  const lines = [];
  let line = "";
  const text = text_input.value;

  canvas.width = dimension.width;
  
  const ctx = canvas.getContext("2d");
  ctx.font = font_size.value + "px Arial";

  // Dzielenie tekstu na kilka liniii
  text.split('\n').forEach((p) =>{
    p.split(" ").forEach((word) => {
      if (ctx.measureText(line + word).width + margin * 2 > dimension.width) {
        lines.push(line);
        line = "";
      }
      line += word + " ";
    })
    lines.push(line);
    line = "";
  });

  let bcolor = document.getElementById("bcolor");
  let fcolor = document.getElementById("fcolor");

  console.log(bcolor, fcolor)
  canvas.height = dimension.height + line_height * lines.length + margin;

  // wypełnianie tła 
  ctx.fillStyle = bcolor.value; 
  ctx.fillRect(0,0,canvas.width, canvas.height);

  ctx.drawImage(photo, 0, canvas.height - dimension.height); //rysowanie zdjecia
  
  //ustawianie koloru czcionki
  ctx.fillStyle = fcolor.value; 
  ctx.font = font_size.value + "px Arial";
  console.log(ctx)
  lines.forEach((elem, idx) => {  // Pisanie wszystkich linijek
    ctx.fillText(elem, margin, (idx + 1) * line_height);
  });

  img.src = canvas.toDataURL("image/png");
  document.getElementById("download")
    .setAttribute("href", img.src)
}
