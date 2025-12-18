export default class ApiFeatures {
  constructor(dbQuery, requestQuery) {
    this.dbQuery = dbQuery;
    this.requestQuery = requestQuery;
  }

  paginate(pageNumber = 1, pageSize = 10) {
    pageNumber = this.requestQuery.pageNumber || pageNumber;
    if(this.requestQuery.pageSize > 100){console.error("PageSize must be less than 100")}
    else pageSize = this.requestQuery.pageSize || pageSize;
    let skip = 0;
    if (pageNumber != 1) skip = (pageNumber - 1) * pageSize;
    this.dbQuery = this.dbQuery.skip(skip).limit(pageSize);
    return this;
  }
  sort(){
    if (this.requestQuery.sort){
      const allowedSorts = [
        "salary,bdate",
        "-salary,-bdate",
        "salary,-bdate",
        "-salary,bdate"
      ];
      if (allowedSorts.includes(this.requestQuery.sort)) {
        const sortBy = this.requestQuery.sort.split(",").join(" ");
        this.dbQuery = this.dbQuery.sort(sortBy);
      } else {
        throw new Error("Invalid sort fields");
      }
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
  filtering(){
    if (this.requestQuery.find){
      const filterBy = this.requestQuery.find.split(",").join(" ");
      this.dbQuery = this.dbQuery.select(filterBy);
    }
    return this
  }
}