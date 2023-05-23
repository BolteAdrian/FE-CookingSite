import { Component, OnInit } from "@angular/core";
import { AddPostService } from "../add-post.service";
import { AuthService } from "../auth/auth.service";
import { PostPayload } from "../utils/interfaces/post-payload";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  posts: PostPayload[];
  searchTerm: string;
  currentPage: number = 1;
  totalPages: number = 0;

  constructor(
    private postService: AddPostService,
    private authService: AuthService
  ) {}

  logout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.loadAllPosts();
  }

  loadAllPosts(
    searchTerm: string = "",
    pageNo: number = 0,
    pageSize: number = 5
  ): void {
    this.postService
      .showAllPostsPaginated(searchTerm, pageNo, pageSize)
      .subscribe((posts) => {
        this.posts = posts;
      });
  }

  loadAllPostsCategory(
    searchTerm: string = "",
    pageNo: number = 0,
    pageSize: number = 5
  ): void {
    this.postService
      .showAllPostsByCategory(searchTerm, pageNo, pageSize)
      .subscribe((posts) => {
        this.posts = posts;
      });
  }

  search(): void {
    this.loadAllPosts(this.searchTerm);
  }

  searchCategory(categoryName: string): void {
    this.loadAllPostsCategory(categoryName);
  }

  onPageChange(pageNumber: number): void {
    const searchTerm = ""; // Termenul de căutare (opțional)
    const pageSize = 5; // Dimensiunea paginii

    const pageNo = pageNumber - 1; // Atribuiți direct `pageNumber - 1` la `pageNo`

    this.loadAllPosts(searchTerm, pageNo, pageSize);
    this.currentPage = pageNumber; // Actualizați valoarea paginii curente
  }
}
