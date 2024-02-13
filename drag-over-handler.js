//Dragover handler
export function dragOverHandler(ev) {
  //Prevents default behaviour
  console.log('Files in drop zone!');
  ev.preventDefault();
  const dragText = document.querySelector('.photo-reciever');
  dragText.textContent = 'Release to Upload!';
};
