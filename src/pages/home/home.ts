import { Component } from '@angular/core';
import { ActionSheetController, NavController, Platform } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  URL_UPLOAD: 'http://192.168.12.194:8080/upload';
  photos: any;

  constructor(public navCtrl: NavController,
              private camera: Camera,
              public actionsheetCtrl: ActionSheetController,
              private transfer: Transfer,
              public platform: Platform) {

  }

  takePicture()
  {
    console.log("taking pic");
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Upload image',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'From camera',
          handler: () => {
            console.log("in handler");
            const options: CameraOptions = {
              mediaType: this.camera.MediaType.PICTURE, // PHOTOLIBRARY
              quality: 100,
              destinationType: this.camera.DestinationType.FILE_URI,
              sourceType: this.camera.PictureSourceType.CAMERA,
              allowEdit: true,
              encodingType: this.camera.EncodingType.JPEG,
              saveToPhotoAlbum: true
            };

            this.camera.getPicture(options).then((imageData) => {

                this.photos.push('data:image/jpeg;base64,' + imageData);

                if(true){

                console.log("trueeeee");
                const fileTransfer: TransferObject = this.transfer.create();

                let myHeaders: Headers = new Headers;
                myHeaders.set('X-API-KEY', 'APIKEYVALUE');

                let options1: FileUploadOptions = {
                  chunkedMode: false,
                  fileKey: 'userfile',
                  fileName: 'name.jpg',
                  headers: myHeaders
                }

                fileTransfer.upload(imageData, this.URL_UPLOAD, options1)
                .then((data) => {
                  alert("upload success!");
                }, (err) => {
                  alert("err: "+JSON.stringify(err));
                });

              }
            }, (err) => {
              alert(err);
            });


          }
        },
        {
          text: 'From galery',
          handler: () => {
            console.log("Gallery handler");
            const options: CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE, //
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              allowEdit: true,
              saveToPhotoAlbum: true
            }

            this.camera.getPicture(options).then((imageData) => {

              this.photos.push('data:image/jpeg;base64,' + imageData);

              if(true) {
                const fileTransfer: TransferObject = this.transfer.create();

                let myHeaders: Headers = new Headers;
                myHeaders.set('X-API-KEY', 'APIKEYVALUE');

                let options1: FileUploadOptions = {
                  chunkedMode: false,
                  fileKey: 'userfile',
                  fileName: 'name.jpg',
                  headers: myHeaders

                }

                fileTransfer.upload(imageData, this.URL_UPLOAD, options1)
                  .then((data) => {
                    alert('File uploaded correctly');
                    // success
                  }, (err) => {
                    // error
                    alert("err: " + JSON.stringify(err));
                  });
              }

            }, (err) => {
              // Handle error
            });


          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();

  }

}
