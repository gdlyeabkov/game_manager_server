import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { min } from 'rxjs';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {

  gameName:string = ''
  filesList:any = []

  @ViewChild('form') form: ElementRef<HTMLFormElement>|null = null;
  @ViewChild('gameUrl') gameUrl:ElementRef<HTMLInputElement>|null = null
  @ViewChild('gameImg') gameImg:ElementRef<HTMLInputElement>|null = null


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  createGame (currentForm:HTMLFormElement) {
    this.form!.nativeElement.action = `http://localhost:4000/?api/games/create/?name=${this.gameName}&url=${`https://digitaldistributtionservice.herokuapp.com/api/games/distributive?name=${this.gameName}`}&url=${`https://digitaldistributtionservice.herokuapp.com/api/games/thumbnail?name=${this.gameName}`}`;
    this.form!.nativeElement.submit()
  }

  openThumbnail (event: any) {
    event.preventDefault();
    (window as any).showOpenFilePicker({     
      types: [
        {
          description: 'Поддерживаемые форматы',
          accept: {
            'image/png': ['.png', '.jpg', '.jpeg', '.bmp', '.gif'],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false
    }).then(async (files: any) => {
      this.filesList = []
      console.log('files: ', files)
      for(let file of files){
        this.filesList.push(await file.getFile())
      }
      console.log('files: ', files)
      this.gameImg!.nativeElement.files = this.FileListItems(
        this.filesList
      )
    }).catch((e:any) => console.log('windowerror: ', e))
  }

  openDistributtive (event: any) {
    event.preventDefault();
    (window as any).showOpenFilePicker({     
      types: [
        {
          description: 'Поддерживаемые форматы',
          accept: {
            'application/x-msdownload': ['.exe'],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false
    }).then(async (files: any) => {
      this.filesList = []
      console.log('files: ', files)
      for(let file of files){
        this.filesList.push(await file.getFile())
      }
      console.log('files: ', files)
      this.gameUrl!.nativeElement.files = this.FileListItems(
        this.filesList
      )
    }).catch((e:any) => console.log('windowerror: ', e))
  }

  uploadFiles ()  {
    this.form!.nativeElement.submit()
  }

  FileListItems (files:any) {
    var b = new ClipboardEvent("").clipboardData || new DataTransfer()
    for (var i = 0, len = files.length; i<len; i++){
      b.items.add(files[i])
    }
    return b.files
  }

}
