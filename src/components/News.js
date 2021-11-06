import React, {useEffect, useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);


  const myStyle = { margin: '20px 20px'};

  const updateNews = async ()=>{
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    props.setProgress(30);
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(50);
    let parsedData = await data.json();
    props.setProgress(70);
    console.log("parsedData", parsedData);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    props.setProgress(100);
    setLoading(false)
  }

  useEffect(() => {
    updateNews()
  }, [])
  
  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1);
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log("parsedData", parsedData);
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
    setLoading(false);

  };

  const capitalize = (str)=>{
    return str[0].toUpperCase() + str.slice(1);
  };
  return (
    <div className="container-my-3">
      <h4 className="text-center" style={{marginTop:'100px'}}>NewsOwl - Top {(props.category==="general")?"":capitalize(props.category)} Headlines</h4>
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length!==totalResults}
        loader={<Spinner/>}
      >
        <div className="container">
          <div className="row" style={myStyle}>         
            {!loading  && articles.map((element) => {
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
News.defaultProps = {
  country:'in',
  pageSize:6,
  category:'general',
  totalResults:0,
}
News.propTypes = {
  country : PropTypes.string,
  pageSize : PropTypes.number,
  category: PropTypes.string,
  totalResults: PropTypes.number,
} 
export default News;
