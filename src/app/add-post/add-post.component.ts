import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormArray, Validators } from "@angular/forms";
import { AddPostService } from "../add-post.service";
import { Router } from "@angular/router";
import { PostPayload } from "../utils/interfaces/post-payload";

@Component({
  selector: "app-add-post",
  templateUrl: "./add-post.component.html",
  styleUrls: ["./add-post.component.css"],
})
export class AddPostComponent implements OnInit {
  addPostForm: FormGroup;
  postPayload: PostPayload;
  title = new FormControl("", Validators.required);
  body = new FormControl("", Validators.required);
  category = new FormControl("", Validators.required);
  picture = new FormControl("");
  shortDescription = new FormControl("", Validators.required);
  methodOfPreparation = new FormControl("", Validators.required);
  selectedFile: File = null;
  file_base64: string = null;

  constructor(private addpostService: AddPostService, private router: Router) {
    this.addPostForm = new FormGroup({
      title: this.title,
      body: this.body,
      shortDescription: this.shortDescription,
      ingredients: new FormArray([]),
      methodOfPreparation: this.methodOfPreparation,
      category: this.category,
      picture: this.picture,
    });
    this.postPayload = {
      id: "",
      content: "",
      shortDescription: "",
      ingredients: [
        {
          name: "",
          quantity: "",
        },
      ],
      methodOfPreparation: "",
      category: "",
      picture: "",
      title: "",
      username: "",
    };
  }

  ngOnInit() {}

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.file_base64 = reader.result as string;
    };
  }

  get ingredientForms() {
    return this.addPostForm.get("ingredients") as FormArray;
  }

  addIngredient() {
    const ingredient = new FormGroup({
      name: new FormControl(""),
      quantity: new FormControl(""),
    });
    this.ingredientForms.push(ingredient);
  }

  deleteIngredient(i: number) {
    this.ingredientForms.removeAt(i);
  }

  addPost() {
    this.postPayload.content = this.addPostForm.get("body").value;
    this.postPayload.title = this.addPostForm.get("title").value;
    this.postPayload.category = this.addPostForm.get("category").value;
    this.postPayload.ingredients = this.addPostForm
      .get("ingredients")
      .value.map((ingredient) => `${ingredient.name}-${ingredient.quantity}`)
      .join(",");
    this.postPayload.methodOfPreparation = this.addPostForm.get(
      "methodOfPreparation"
    ).value;
    this.postPayload.picture = this.file_base64;
    this.postPayload.shortDescription =
      this.addPostForm.get("shortDescription").value;

    this.addpostService.addPost(this.postPayload).subscribe(
      (data) => {
        console.log("SUCCES: " + data);
      },
      (error) => {
        console.log("Failure Response: " + error.message);
      }
    );
    setTimeout(() => {
      history.back();
    }, 1000);
  }
}
