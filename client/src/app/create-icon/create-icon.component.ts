import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-create-icon',
  templateUrl: './create-icon.component.html',
  styleUrls: ['./create-icon.component.css']
})
export class CreateIconComponent implements OnInit {

  title:string = ''
  desc:string = ''
  filesList:any = []
  ext:string = ''

  @ViewChild('form') form: ElementRef<HTMLFormElement>|null = null;  
  @ViewChild('icon') icon: ElementRef<HTMLInputElement>|null = null

  constructor() { }

  ngOnInit(): void {
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
      this.icon!.nativeElement.files = this.FileListItems(
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
