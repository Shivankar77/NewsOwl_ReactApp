import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {

  static defaultProps = {
    country:'in',
    pageSize:6,
    category:'general',
    totalResults:0,
  }
  static propTypes = {
    country : PropTypes.string,
    pageSize : PropTypes.number,
    category: PropTypes.string,
    totalResults: PropTypes.number,
  } 
  myStyle = { margin: '20px 20px'};
  constructor() {
    super();
    console.log("Im a constrcutor");
    this.state = {
      articles: [],
      loading: true,
      page: 1,
    };
  }
  async updateNews(){
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.props.setProgress(30);
    let data = await fetch(url);
    this.props.setProgress(50);
    let parsedData = await data.json();
    this.props.setProgress(70);
    console.log("parsedData", parsedData);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading:false
    });
    this.props.setProgress(100);
  }
  async componentDidMount() {
    this.setState({page: this.state.page = 1});
    this.updateNews();
  }
  
  fetchMoreData = async () => {
    this.setState({
      page: this.state.page+=1
    })
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log("parsedData", parsedData);
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
      loading:false
    });
  };

  capitalize =(str)=>{
    return str[0].toUpperCase() + str.slice(1);
  };
  render() {
    return (
      <div className="container-my-3">
        <h4 className="text-center" style={{margin:'30px 0px'}}>NewsOwl - Top {(this.props.category==="general")?"":this.capitalize(this.props.category)} Headlines</h4>
        {/* {this.state.loading && <Spinner/>} */}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length!==this.state.totalResults}
          loader={<Spinner/>}
        >
          <div className="container">
            <div className="row" style={this.myStyle}>         
            {!this.state.loading && this.state.articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 45) : ""}
                    description={
                      element.description ? element.description.slice(0, 88) : ""
                    }
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author = {element.author}
                    date = {element.publishedAt}
                    source = {element.source.name}
                  />
                </div>
              );
            })}
        </div>
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}

export default News;
