import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { PostPayload } from './utils/interfaces/post-payload';

@Injectable({
  providedIn: 'root'
})
export class AddPostService {

  constructor(private httpClient: HttpClient) {
  }

  addPost(postPayload: PostPayload){
    return this.httpClient.post('http://localhost:8080/api/posts/', postPayload);
  }

  editPost(permaLink: Number,postPayload: PostPayload){
    return this.httpClient.put('http://localhost:8080/api/posts/'+ permaLink, postPayload);
  }

  deletePost(permaLink: Number):Observable<PostPayload>{
    return this.httpClient.delete<PostPayload>('http://localhost:8080/api/posts/delete/' + permaLink);
  }

  getAllPosts(): Observable<Array<PostPayload>>{
    return this.httpClient.get<Array<PostPayload>>("http://localhost:8080/api/posts/all");
  }

  getPost(permaLink: Number):Observable<PostPayload>{
    return this.httpClient.get<PostPayload>('http://localhost:8080/api/posts/get/' + permaLink);
  }
}

