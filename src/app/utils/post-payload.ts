export class PostPayload {
  id: String;
  content: String;
  shortDescription: String;
  category: String;
  ingredients: String | object[];
  methodOfPreparation: String;
  picture: String;
  title: String;
  username: String;
}
