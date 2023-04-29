import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
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
  pictureURL: string;
  editPostForm = this.fb.group({
    name: [""],
    title: [""],
    content: [""],
    shortDescription: [""],
    ingredients: this.fb.array([
      this.fb.group({
        name: [""],
        quantity: [""],
      }),
    ]),
    methodOfPreparation: [""],
    category: [""],
    picture: [""],
  });

  selectedFile: File = null;

  file_base64: FileReader = new FileReader();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private addpostService: AddPostService,
    private router: ActivatedRoute
  ) {
    this.postPayload = {
      id: "",
      title: "",
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
      username: "",
    };
  }

  getData(id: string) {
    this.http
      .get(`http://localhost:8080/api/posts/get/${id}`)
      .subscribe((data) => {
        const ingredients = [];

        data["ingredients"].split(",").forEach((substr) => {
          const [name, quantity] = substr.split("-");
          const ingredient = { name, quantity };
          ingredients.push(ingredient);
        });
        this.pictureURL = data["picture"];
        this.data = {
          id: data["id"],
          title: data["title"],
          content: data["content"],
          shortDescription: data["shortDescription"],
          ingredients: ingredients,
          methodOfPreparation: data["shortDescription"],
          category: data["category"],
          picture: data["picture"],
          username: data["username"],
        };

        this.editPostForm.patchValue(this.data);

        this.editPostForm.setControl(
          "ingredients",
          this.fb.array(
            ingredients.map((ing) => {
              return this.fb.group({
                name: ing.name,
                quantity: ing.quantity,
              });
            })
          )
        );
      });
  }

  ngOnInit() {
    this.router.params.subscribe((params) => {
      this.getData(params["id"]);
      this.permaLink = params["id"];
    });
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    this.file_base64.readAsDataURL(this.selectedFile);
    this.file_base64.onload = () => {
      console.log(this.file_base64.result);
    };
  }

  get ingredientForms() {
    return this.editPostForm.get("ingredients") as FormArray;
  }

  addIngredient() {
    const ingredient = this.fb.group({
      name: [""],
      quantity: [""],
    });
    this.ingredientForms.push(ingredient);
  }

  deleteIngredient(i: number) {
    this.ingredientForms.removeAt(i);
  }

  editPost() {
    this.postPayload.content = this.editPostForm.value["content"];
    this.postPayload.title = this.editPostForm.value["title"];
    this.postPayload.ingredients = this.editPostForm
      .get("ingredients")
      .value.map((ingredient) => `${ingredient.name}-${ingredient.quantity}`)
      .join(",");
    this.postPayload.methodOfPreparation = this.editPostForm.get(
      "methodOfPreparation"
    ).value;
    this.postPayload.category = this.editPostForm.value["category"];
    if (String(this.file_base64.result).length > 5) {
      console.log(String(this.file_base64.result).length);
      this.postPayload.picture = String(this.file_base64.result);
    } else {
      this.postPayload.picture = this.pictureURL;
    }
    this.postPayload.shortDescription =
      this.editPostForm.value["shortDescription"];
    this.addpostService.editPost(this.permaLink, this.postPayload).subscribe(
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
