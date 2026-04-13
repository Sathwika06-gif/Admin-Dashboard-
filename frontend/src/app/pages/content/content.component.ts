import { Component } from '@angular/core';
import { ContentService } from '../../services/content.service';

@Component({
 selector:'app-content',
 templateUrl:'./content.component.html'
})
export class ContentComponent{

 form:any={};

 constructor(private service:ContentService){}

 save(){
   this.service.add(this.form).subscribe(()=>alert("Saved"));
 }
}