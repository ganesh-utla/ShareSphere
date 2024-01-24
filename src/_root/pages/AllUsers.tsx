import { Loader, SearchResults, UserCard } from "@/components/shared";
import { Input } from "@/components/ui/input"
import { useUserContext } from "@/context/AuthContext";
import { useDebounce } from "@/hooks";
import { useGetAllUsers, useSearchUsers } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer";


const AllUsers = () => {

  const { data: users, fetchNextPage, hasNextPage } = useGetAllUsers();

  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
  const { data: searchedUsers, isFetching: isSearchFetching } = useSearchUsers(debouncedValue);
  const { user: currentUser } = useUserContext();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !searchValue) fetchNextPage();
  }, [inView, searchValue]);

  if (!users) {
    return (
      <div className="w-full flex-center h-full">
        <Loader />
      </div>
    )
  }
  
  const shouldShowSearchResults = searchValue!=='';
  const noUsersToShow = !shouldShowSearchResults && users.pages.every((item) => item?.documents.length === 0);

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold w-full">
          Search Users
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

      <div className="w-full max-w-5xl flex flex-wrap gap-9 mt-10">
        {shouldShowSearchResults? (
          <SearchResults 
            isSearchFetching={isSearchFetching}
            searchedResults={searchedUsers}
            isUserGrid={true}
          />
        ) : noUsersToShow? (
          <p className="text-light-4 mt-10 text-center w-full">
            No users found
          </p>
        ) : (
          users.pages.map((item, index) => (
            <ul className="user-grid" key={index}>
              {item?.documents.filter(user => user.$id !== currentUser.id).map((user) => (
                <li key={user.$id} className="flex-1 min-w-[200px] w-full">
                  <UserCard user={user} key={user.$id} />
                </li>
              ))}
            </ul>
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

export default AllUsers