import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrl: './video.component.css',
})
export class VideoComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElementRef:
    | ElementRef<HTMLVideoElement>
    | undefined;
  @ViewChild('canvasElement') canvasElementRef:
    | ElementRef<HTMLCanvasElement>
    | undefined;
  image: string='';

  ngAfterViewInit(): void {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if(this.videoElementRef)
          this.videoElementRef.nativeElement.srcObject = stream;
        })
        .catch((err) => {
          console.log('Error accessing the camera', err);
        });
    } else {
      alert('getUserMedia not supported on your browser!');
    }
  }

  captureImage(): void {
    if (this.canvasElementRef && this.videoElementRef) {
      const canvasContext =
        this.canvasElementRef.nativeElement.getContext('2d');
      if (canvasContext) {
        canvasContext.drawImage(
          this.videoElementRef.nativeElement,
          0,
          0,
          480,
          320
        );
        this.image =
          this.canvasElementRef.nativeElement.toDataURL('image/png');
        console.log(this.image); // Display the captured image data in the console. You can use it to save the captured image to a file or send it to a server for further processing.
      }
    }
  }
}
