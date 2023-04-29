import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AddPostService} from '../add-post.service';
import {PostPayload} from '../utils/post-payload';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';

// @ts-ignore
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  post: PostPayload;
  permaLink: Number;
  

  constructor(private router: ActivatedRoute, private postService: AddPostService,private authService: AuthService, private router2: Router) {
  }

  logout() {
    this.authService.logout();
  }


  ngOnInit() {
    this.router.params.subscribe(params => {
      this.permaLink = params['id'];
    });

    this.postService.getPost(this.permaLink).subscribe((data:PostPayload) => {
      this.post = data;
    },(err: any) => {
      console.log('Failure Response');
    })
  }

  deletePost() {

    if (confirm('Are you sure you want to delete this data?')) {
    
    this.postService.deletePost(this.permaLink).subscribe((data:PostPayload) => {
      this.post = data;
      this.router2.navigateByUrl('/');
    },(err: any) => {
      console.log('Failure Response');
    })
    setTimeout(()=> {
      history.back();
   }
   ,1000);
  }
}

  editPost(){
    this.router2.navigate([`/edit-post/${ this.permaLink}`]);
  }
  
}
