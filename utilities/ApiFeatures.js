export default class ApiFeatures {
  constructor(dbQuery, requestQeury) {
    this.dbQuery = dbQuery;
    this.requestQeury = requestQeury;
  }

  paginate(pageNumber = 1, pageSize = 5) {
    pageNumber = Number(this.requestQeury.pageNumber) || pageNumber;
    pageSize = Number(this.requestQeury.pageSize) || pageSize;
    let skip = 0;
    if (pageNumber !== 1) skip = (pageNumber - 1) * pageSize;
    this.dbQuery.skip(skip).limit(pageSize).sort({ _id: -1 });
    return this;
  }
  sort() {
    if (this.requestQeury.sort) {
      const sortBy = this.requestQeury.sort.split(",").join(" ");
      this.dbQuery.sort(sortBy);
    }
    return this;
  }
  projection() {
    if (this.requestQeury.project) {
      const projectionStr = this.requestQeury.project.split(",").join(" ");
      console.log(projectionStr);
      this.dbQuery.select(projectionStr);
    }
    return this;
  }
};