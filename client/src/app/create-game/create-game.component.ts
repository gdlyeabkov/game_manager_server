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
  platform:string = 'Любая'
  price:number = 99
  isPriceDisabled:boolean = true
  tags: Array<GameTagCheckBoxData> = []
  type: string = 'Продукты в раннем доступе'
  genre: string = 'Инди'
  desc: string = ''
  developer: string = ''
  editor: string = ''

  @ViewChild('form') form: ElementRef<HTMLFormElement>|null = null;
  @ViewChild('gameUrl') gameUrl:ElementRef<HTMLInputElement>|null = null
  @ViewChild('gameImg') gameImg:ElementRef<HTMLInputElement>|null = null
  @ViewChild('platformSelector') platformSelector:ElementRef<HTMLSelectElement>|null = null
  @ViewChild('priceRef') priceRef:ElementRef<HTMLInputElement>|null = null
  @ViewChild('typeSelector') typeSelector:ElementRef<HTMLSelectElement>|null = null
  @ViewChild('genreSelector') genreSelector:ElementRef<HTMLSelectElement>|null = null

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getTags()
  }

  createGame (currentForm:HTMLFormElement) {
    this.form!.nativeElement.action = `https://loud-reminiscent-jackrabbit.glitch.me/api/games/create/?name=${this.gameName}&url=${`https://digitaldistributtionservice.herokuapp.com/api/games/distributive?name=${this.gameName}`}&url=${`https://digitaldistributtionservice.herokuapp.com/api/games/thumbnail?name=${this.gameName}`}`;
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

  onChangePlatform () {
    const platformBox = this.platformSelector!.nativeElement
    const selectedPlatformIndex = platformBox.selectedIndex
    const platformBoxItems = platformBox.options
    const selectedPlatformItem = platformBoxItems[selectedPlatformIndex]
    const selectedPlatform = selectedPlatformItem.value
    this.platform = selectedPlatform
  }

  onChangeType () {
    const typeBox = this.typeSelector!.nativeElement
    const selectedTypeIndex = typeBox.selectedIndex
    const typeBoxItems = typeBox.options
    const selectedTypeItem = typeBoxItems[selectedTypeIndex]
    const selectedType = selectedTypeItem.value
    this.type = selectedType
  }

  disablePriceField () {
    this.isPriceDisabled = true
  }

  enablePriceField () {
    this.isPriceDisabled = false
  }

  getDisabledPrice () {
    return this.isPriceDisabled
  }

  getPrice () {
    let gamePrice = this.price
    if (this.isPriceDisabled) {
      gamePrice = 0
    }
    return gamePrice
  }

  getTags () {
    this.http.get(
      `https://loud-reminiscent-jackrabbit.glitch.me/api/games/tags/all`
    ).subscribe(
      (value: any) => {
        const status = value['status'];
        const isOkStatus = status === 'OK';
        if (isOkStatus) {
          const totalTags = value['tags'];
          for (let tag of totalTags) {
            this.tags.push(new GameTagCheckBoxData(tag['_id'], tag['title']))
          }
          // this.tags = totalTags
        }
      }
    );
  }

  toggleTag (event: Event, tag: GameTagCheckBoxData) {
    const checkbox:HTMLInputElement|any = event.target
    const isChecked = checkbox.checked
    tag.isChecked = isChecked
  }

  getTagRelations () {
    const tagRelations = this.tags.flatMap((tag) => tag.isChecked)
    const rawTagRelations = tagRelations.join(',')
    return rawTagRelations
  }

  onChangeGenre () {
    const genreBox = this.genreSelector!.nativeElement
    const selectedGenreIndex = genreBox.selectedIndex
    const genreBoxItems = genreBox.options
    const selectedGenreItem = genreBoxItems[selectedGenreIndex]
    const selectedGenre = selectedGenreItem.value
    this.genre = selectedGenre
  }

}

interface GameTagModel {
  _id: string
  title: string
}

class GameTagCheckBoxData {
  
  _id: string
  title: string
  isChecked: boolean

  constructor (_id: string, title: string) {
    this._id = _id
    this.title = title
    this.isChecked = true
  }

}
