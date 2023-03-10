import React, { useState, useEffect } from "react";
import { Loader, FormField, Card } from "../components";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }
  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, setloading] = useState(false);

  const [allposts, setallposts] = useState(null);

  const [searchText, setsearchText] = useState("");
  const [searchedResults, setSearchResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setloading(true);
      try {
        const responce = await fetch("http://localhost:8080/api/v1/posts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (responce.ok) {
          const result = await responce.json();
          setallposts(result.data.reverse());
        }
      } catch (error) {
        alert(error);
      } finally {
        setloading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setsearchText(e.target.value);
    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allposts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchResults(searchResults);
      }, 500)
    );
  };
  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#22328] text-[32px]">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w[500px]">
          Browse through a collection of imaginative and visually stunning
          images generated bt DALI-AI
        </p>
      </div>

      <div className="mt-16">
        <FormField
          LableName="search posts"
          type="text"
          name="text"
          placeholder="Search Posts"
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing result for{" "}
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards data={searchedResults} title="no search results" />
              ) : (
                <RenderCards data={allposts} title="no post found" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
