import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-create-experiment',
  templateUrl: './create-experiment.component.html',
  styleUrls: ['./create-experiment.component.css']
})
export class CreateExperimentComponent implements OnInit {

  title:string = ''
  desc:string = ''
  filesList:any = []
  imgFileType = ''
  docFileType = ''
  @ViewChild('form') form: ElementRef<HTMLFormElement>|null = null;
  @ViewChild('photo') photo:ElementRef<HTMLInputElement>|null = null
  @ViewChild('document') document:ElementRef<HTMLInputElement>|null = null

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
      for(let file of files){
        const filesListItem = await file.getFile()
        this.filesList.push(filesListItem)
        this.imgFileType = filesListItem.type
      }
      this.photo!.nativeElement.files = this.FileListItems(
        this.filesList
      )
    }).catch((e:any) => console.log('windowerror: ', e))
  }

  openDocument (event: any) {
    event.preventDefault();
    (window as any).showOpenFilePicker({     
      types: [
        {
          description: 'Поддерживаемые форматы',
          accept: {
            'application/msword': ['.doc', '.docx', '.docm'],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false
    }).then(async (files: any) => {
      this.filesList = []
      for(let file of files){
        const filesListItem = await file.getFile()
        this.filesList.push(filesListItem)
        this.docFileType = filesListItem.type
      }
      this.document!.nativeElement.files = this.FileListItems(
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
