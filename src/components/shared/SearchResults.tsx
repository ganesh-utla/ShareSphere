import { Models } from "appwrite";
import { Loader, GridPostList, GridUserList } from ".";

type SearchResultsProps = {
  isSearchFetching: boolean;
  searchedResults: Models.DocumentList<Models.Document> | undefined;
  isUserGrid?: boolean;
}

const SearchResults = ({ isSearchFetching, searchedResults, isUserGrid } : SearchResultsProps) => {

  if (isSearchFetching) {
    return (
      <div className="w-full flex-center h-full">
        <Loader />
      </div>
    );
  }

  if (searchedResults && searchedResults.documents.length > 0) {

    if (isUserGrid) {
      return (
        <GridUserList
          users={searchedResults.documents}
        />
      );
    } else {
      return (
        <GridPostList
          posts={searchedResults.documents}
        />
      );
    }

  }

  return (
    <p className="text-light-4 text-center w-full mt-10">No {isUserGrid? "users" : "posts"} found</p>
  )
}

export default SearchResults