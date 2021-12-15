import {userName, ws} from './index.js'

// const fs = require('fs');

window.onload = function() {

// const peopleItem = document.querySelectorAll('.people__item');
const menuBtn = document.querySelector('.menu__btn');
const addPhotoPopup = document.querySelector('.popup--addphoto');
const addPhotouserName = document.querySelector('.addphoto__username');
const imageDropZone = document.querySelector('.addphoto__photo-wrap');


menuBtn.addEventListener('click', function(e) { // как проверить открыто ли уже соединение?
  addPhotoPopup.classList.remove('hide')
  addPhotouserName.innerHTML = userName; 
})


imageDropZone.addEventListener('dragstart', function(e) {
});

imageDropZone.addEventListener('dragover', function(e) {
  e.preventDefault();
});

imageDropZone.addEventListener('drop', function(e) {
  e.preventDefault();
  const dt = e.dataTransfer;

  if (dt.files && dt.files.length) {
    for (const file of dt.files) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        const photoUser = reader.result;
        imageDropZone.style.backgroundImage = `url('${photoUser}')`;
        imageDropZone.style.backgroundSize = 'cover';

        ws.send(JSON.stringify({type: 'changePhoto', userPhoto: imageDropZone.style.backgroundImage})) 
      })
    }
  }
});

};