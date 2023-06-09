import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ModalModule } from "ngx-bootstrap/modal";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { RegisterComponent } from "./auth/register/register.component";
import { LoginComponent } from "./auth/login/login.component";
import { RegisterSuccessComponent } from "./auth/register-success/register-success.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { Ng2Webstorage } from "ngx-webstorage";
import { HomeComponent } from "./home/home.component";
import { AddPostComponent } from "./add-post/add-post.component";
import { EditorModule } from "@tinymce/tinymce-angular";
import { HttpClientInterceptor } from "./http-client-interceptor";
import { PostComponent } from "./post/post.component";
import { AuthGuard } from "./auth.guard";
import { EditPostComponent } from "./edit-post/edit-post.component";
import { DeleteModalComponent } from "./utils/modals/delete-modal/delete-modal.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RegisterComponent,
    LoginComponent,
    RegisterSuccessComponent,
    HomeComponent,
    AddPostComponent,
    PostComponent,
    EditPostComponent,
    DeleteModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng2Webstorage.forRoot(),
    ModalModule.forRoot(),
    RouterModule.forRoot([
      { path: "", component: HomeComponent },
      { path: "register", component: RegisterComponent },
      { path: "post/:id", component: PostComponent },
      { path: "login", component: LoginComponent },
      { path: "register-success", component: RegisterSuccessComponent },
      { path: "home", component: HomeComponent },
      {
        path: "add-post",
        component: AddPostComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "edit-post/:id",
        component: EditPostComponent,
        canActivate: [AuthGuard],
      },
    ]),
    HttpClientModule,
    EditorModule,
  ],
  entryComponents: [DeleteModalComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpClientInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
