import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { AddPostService } from "../add-post.service";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { PostPayload } from "../utils/post-payload";


@Component({
  selector: "app-edit-post",
  templateUrl: "./edit-post.component.html",
  styleUrls: ["./edit-post.component.css"],
})
export class EditPostComponent implements OnInit {
  postPayload: PostPayload;
  data: any;
  permaLink: Number;
  editPostForm = this.fb.group({
    name: [""],
    title: [""],
    content: [""],
    shortDescription:[""],
    category: [""],
    picture: [""],
  });

  selectedFile:File = null;

  file_base64:FileReader = new FileReader();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private addpostService: AddPostService,
    private router: ActivatedRoute
  ) {
    this.postPayload = {
      id: "",
      content: "",
      shortDescription: "",
      ingredients: "",
      methodOfPreparation: "",
      category: "",
      picture: "",
      title: "",
      username: "",
    }
  }

  getData(id: string) {
    this.http.get(`http://localhost:8080/api/posts/get/${id}`).subscribe((data) => {
      
    
    this.data = {
        id: data['id'],
        title: data['title'],
        content: data['content'],
        shortDescription: data['short_description'], //de reparat numele
        category: data['category'],
        picture: data['picture'],
        ingredients: data['ingredients'],
        methodOfPreparation: data['methodOfPreparation'],
        username: data['username'],
      };

      this.editPostForm.patchValue(this.data);
    });
  }

  ngOnInit() {
    this.router.params.subscribe((params) => {
      this.getData(params["id"]);
      this.permaLink = params['id'];
    });
  }

  onFileSelected(event:any) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile)
    this.file_base64.readAsDataURL(this.selectedFile);
    this.file_base64.onload = () => {
        console.log(this.file_base64.result);
    };
  }


  editPost() {

    this.postPayload.content = this.editPostForm.value['content'];
    this.postPayload.title = this.editPostForm.value['title'];
    this.postPayload.category = this.editPostForm.value['category'];
    this.postPayload.ingredients = this.editPostForm.get("ingredients").value;
    this.postPayload.methodOfPreparation = this.editPostForm.get("methodOfPreparation").value;
    this.postPayload.picture = String(this.file_base64.result);
    this.postPayload.shortDescription = this.editPostForm.value['shortDescription'];
    this.addpostService.editPost(this.permaLink,this.postPayload).subscribe(data => {
      console.log('SUCCES');
    }, error => {
      console.log('Failure Response');
    })
     setTimeout(()=> {
      history.back();
   }
   ,1000);
  }
}
