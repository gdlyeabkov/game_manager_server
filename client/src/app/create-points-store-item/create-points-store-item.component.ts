import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-create-points-store-item',
  templateUrl: './create-points-store-item.component.html',
  styleUrls: ['./create-points-store-item.component.css']
})
export class CreatePointsStoreItemComponent implements OnInit {

  title:string = ''
  desc:string = ''
  type:string = ''
  filesList:any = []
  ext:string = ''
  price:number = 99

  @ViewChild('form') form: ElementRef<HTMLFormElement>|null = null;  
  @ViewChild('typeSelector') typeSelector:ElementRef<HTMLSelectElement>|null = null
  @ViewChild('preview') preview: ElementRef<HTMLInputElement>|null = null

  constructor() { }

  ngOnInit(): void {
  }

  onChangeType () {
    const typeBox = this.typeSelector!.nativeElement
    const selectedPlatformIndex = typeBox.selectedIndex
    const typeBoxItems = typeBox.options
    const selectedTypeItem = typeBoxItems[selectedPlatformIndex]
    const selectedType = selectedTypeItem.value
    this.type = selectedType
  }

  openPhoto (event: any) {
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
        const filesListItem = await file.getFile()
        this.filesList.push(filesListItem)
        this.ext = filesListItem.type
      }
      console.log('files: ', files)
      this.preview!.nativeElement.files = this.FileListItems(
        this.filesList
      )
    }).catch((e:any) => console.log('windowerror: ', e))
  }

  FileListItems (files:any) {
    var b = new ClipboardEvent("").clipboardData || new DataTransfer()
    for (var i = 0, len = files.length; i<len; i++){
      b.items.add(files[i])
    }
    return b.files
  }

  uploadFiles ()  {
    this.form!.nativeElement.submit()
  }

}
