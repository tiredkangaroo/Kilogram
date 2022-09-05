export default interface PostDataInterface {
  _id: string,
  authorUsername: string,
  authorID: string,
  imageKey: string,
  text: string,
  date_created: Date,
  likerIDs: Object,
  comments: Array<any>
}