import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AddPostService } from "../add-post.service";
import { PostPayload } from "../utils/post-payload";
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

// @ts-ignore
@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.css"],
})
export class PostComponent implements OnInit {
  post: PostPayload;
  permaLink: Number;

  constructor(
    private router: ActivatedRoute,
    private postService: AddPostService,
    private authService: AuthService,
    private router2: Router,
    private location: Location
  ) {}

  logout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.router.params.subscribe((params) => {
      this.permaLink = params["id"];
    });

    this.postService.getPost(this.permaLink).subscribe(
      (data: PostPayload) => {
        const ingredients = [];
        String(data["ingredients"])
          .split(",")
          .forEach((substr) => {
            const [name, quantity] = substr.split("-");
            const ingredient = { name, quantity };
            ingredients.push(ingredient);
          });

        this.post = data;
        this.post.ingredients = ingredients;
      },
      (error: any) => {
        console.log("Failure Response:" + error.message);
      }
    );
  }

  deletePost() {
    if (confirm("Are you sure you want to delete this recipe?")) {
      this.postService.deletePost(this.permaLink).subscribe(
        (data: PostPayload) => {
          this.post = data;
          this.router2.navigateByUrl("/");
        },
        (error: any) => {
          console.log("Failure Response:" + error.message);
        }
      );
      setTimeout(() => {
        history.back();
      }, 1000);
    }
  }

  editPost() {
    this.router2.navigate([`/edit-post/${this.permaLink}`]);
  }

  goBack(): void {
    this.location.back();
  }
}
