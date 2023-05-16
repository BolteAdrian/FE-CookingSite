import { Component, OnInit } from '@angular/core';
import {AddPostService} from '../add-post.service';
import {Observable} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import { PostPayload } from '../utils/interfaces/post-payload';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: Observable<Array<PostPayload>>;
  constructor(private postService: AddPostService ,private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.posts = this.postService.getAllPosts();
  }

}
