export function dragLeaveHandler(ev) {
  //Changes text within photo-reciever back to normal.
  ev.preventDefault();
  const dragText = document.querySelector('.photo-reciever');
  dragText.textContent = 'Drag and drop images here!';
  };