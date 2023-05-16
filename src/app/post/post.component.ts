import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AddPostService } from "../add-post.service";
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { PostPayload } from "../utils/interfaces/post-payload";
import { DeleteModalComponent } from "../utils/modals/delete-modal/delete-modal.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

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
    private location: Location,
    private modalService: BsModalService
  ) {}
  private modalRef: BsModalRef;
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
    this.modalRef = this.modalService.show(DeleteModalComponent);

    this.modalRef.content.confirmDelete.subscribe(() => {
      // User clicked the confirm button
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
    });

    this.modalRef.content.cancelDelete.subscribe(() => {
      // User clicked the cancel button or closed the modal
      console.log("Delete canceled");
    });
  }

  editPost() {
    this.router2.navigate([`/edit-post/${this.permaLink}`]);
  }

  goBack(): void {
    this.location.back();
  }
}
