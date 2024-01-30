import { Loader, SearchResults, GridPostList } from "@/components/shared";
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks";
import { useGetInfinitePosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer";


const Explore = () => {

  const { data: posts, fetchNextPage, hasNextPage } = useGetInfinitePosts();

  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedValue);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !searchValue) fetchNextPage();
  }, [inView, searchValue]);

  if (!posts) {
    return (
      <div className="w-full flex-center h-full">
        <Loader />
      </div>
    )
  }
  
  const shouldShowSearchResults = searchValue!=='';
  const noPostsToShow = !shouldShowSearchResults && posts.pages.every((item) => item?.documents.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">
          Search Posts
        </h2>
        <div className="w-full flex items-center max-w-5xl bg-light-5 px-4 rounded-lg gap-1">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            className="w-6 h-6"
          />
          <Input 
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="explore-search"
          />
        </div>
      </div>

      <div className="w-full flex-between mt-12 mb-7 max-w-5xl">
        <h3 className="body-bold md:h3-bold">
          Popular Today
        </h3>
        <div className="flex-center bg-light-6 py-2 px-4 gap-3 rounded-xl cursor-pointer hover:bg-light-7" onClick={() => setSearchValue("")}>
          <p className="text-light-4">
            All
          </p>
          <img
            src="/assets/icons/filter.svg"
            alt="filter"
            className="w-4 h-4"
          />
        </div>
      </div>

      <div className="w-full max-w-5xl flex flex-wrap gap-9">
        {shouldShowSearchResults? (
          <SearchResults 
            isSearchFetching={isSearchFetching}
            searchedResults={searchedPosts}
          />
        ) : noPostsToShow? (
          <p className="text-light-4 mt-10 text-center w-full">
            No posts found
          </p>
        ) : (
          posts.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts={item?.documents} />
          ))
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}

    </div>
  )
}

export default Explore