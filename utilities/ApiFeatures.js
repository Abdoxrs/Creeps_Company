module.exports = class ApiFeatures {
  constructor(dbQuery, requestQuery) {
    this.dbQuery = dbQuery;
    this.requestQuery = requestQuery;
  }

  paginate(pageNumber = 1, pageSize = 5) {
    pageNumber = this.requestQuery.pageNumber || pageNumber;
    pageSize = this.requestQuery.pageSize || pageSize;
    let skip = 0;
    if (pageNumber != 1) skip = (pageNumber - 1) * pageSize;
    this.dbQuery = this.dbQuery.skip(skip).limit(pageSize);
    return this;
  }
  sort(){
    if (this.requestQuery.sort){
      const sortBy = this.requestQuery.sort.split(",").join(" ");
      this.dbQuery = this.dbQuery.sort(sortBy);
    }
    return this;
  }
  projection(){
    if (this.requestQuery.project){
      const projectBy = this.requestQuery.project.split(",").join(" ");
      this.dbQuery = this.dbQuery.select(projectBy);
    }
    return this;
  }
};