//Drop handler
export function dropHandler(ev) {
  console.log("File(s) dropped!");
  ev.preventDefault();
  const dragText = document.querySelector('.photo-reciever');
  dragText.textContent = 'Drag and drop images from your file manager into this Drop Zone!';
    
  if (ev.dataTransfer.items) {
    //Use dataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach((item, i) => {
      //If dropped items aren't files, reject them
      if (item.kind === 'file') {
        const file = item.getAsFile();
        console.log(`… file[${i}].name = ${file.name}`);
  
        // Type-checking for valid image files (JPG, JPEG, PNG)
        let fileType = file.type;
        let validExtensions = ['image/jpg', 'image/jpeg', 'image/png'];
  
        // If dropped image is valid format, accept
        if(validExtensions.includes(fileType)) {
        const reader = new FileReader();
          reader.onload = () => {
            window.imgURL = reader.result;
            const submitted_img = document.createElement('img');
            submitted_img.src = imgURL;
            submitted_img.setAttribute("id", "dropped_img");
            document.getElementById("drop-zone").innerHTML = ""
            document.getElementById("drop-zone").appendChild(submitted_img);
  
        };
        reader.readAsDataURL(file);
      } else {
        alert('Oops! Images must be of the format JPG, JPEG, or PNG!')
      };
      }
    });
  } else {
    //Use dataTransfer interface to access the files
    [...ev.dataTransfer.files].forEach((file, i) => {
      console.log(`… file[${i}].name = ${file.name}`);
    });
  }
};
  