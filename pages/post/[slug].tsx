import { GetStaticProps } from "next";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typing";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    }).then(() => {
      console.log(data);
      setSubmitted(true);
    }).catch((err) => {
      console.log(err);
      setSubmitted(false);
    })
  }

  return (
    <main>
      <Header/>

      <img className="w-full h-40 object-cover " src={urlFor(post.mainImage).url()!} alt="" />

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>
        
        <div className="flex items-center space-x-2">
          <img className="h-10 w-10 rounded-full" src={urlFor(post.author.image).url()!} alt="" />
          <p className="font-extralight text-sm">
            Blog post by <span className="text-green-600">{post.author.name}</span> - Published at {" "} {new Date(post._createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-10">
        <PortableText
            className=""
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            content={post.body}
            serializers={
              {
                h1: (props: any) => (
                  <h1 className="text-2xl font-bold my-5" {...props}/>
                ),
                h2: (props: any) => (
                  <h1 className="text-2xl font-bold my-5" {...props}/>
                ),
                li: ({ children }: any) => (
                  <li className="ml-4 list-disc">{children}</li>
                ),
                link: ({ href, children }: any) => (
                  <a href={href} className="text-blue-500 hover:underline">
                    {children}
                  </a>
                ),
              }
            }/>
        </div>
      </article>

      <hr className="max-w-lg my-5 mx-auto border border-blue-400"/>
      
      {submitted ? (
        <div className="flex flex-col p-10 my-10 bg-blue-100 text-blue-700 max-w-2xl mx-auto rounded-lg dark:bg-blue-200 dark:text-blue-800">
          <h3 className="text-3xl font-bold">
            Thank you for submitting your comment!
          </h3>
          <p>
            Once it has been approved, it will appear below!
          </p>
        </div>
      ): (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5 max-w-2xl mx-auto mb-10">
          <h3 className="text-sm text-blue-500"> Enjoy this article? </h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="py-3 mt-2"/>
          
          <input
          {...register("_id")}
          type="hidden"
          name="_id"
          value={post._id}
          />

          <div className="relative z-0 mb-6 w-full group">
            <input 
            {...register("name", { required:true })}
            type="text" 
            className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-blue-400 dark:focus:border-blue-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
            placeholder=" "
            />
            <label className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-400 peer-focus:dark:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
          </div>
          <div className="relative z-0 mb-6 w-full group">
            <input 
            {...register("email", { required:true })}
            type="email" 
            className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-blue-400 dark:focus:border-blue-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
            placeholder=" "
            />
            <label className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-400 peer-focus:dark:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
          </div>
          <label className="block mb-5">
            <span className="text-blue-400 text-sm font-bold">Comment</span>
            <textarea 
            {...register("comment",{ required:true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2 ring-blue-400 focus:ring" 
            placeholder="Your comment..." 
            rows={4} />
          </label>

          <div className="flex flex-col p-5">
            { errors.name && (
              <span className="text-red-500">- The Name Field is required</span>
            )}
            { errors.email && (
              <span className="text-red-500">- The Email Field is required</span>
            )}
            { errors.comment && (
              <span className="text-red-500">- The Comment Field is required</span>
            )}
          </div>

          <button type="submit" className="shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:outline-none font-bold text-center py-2 px-4 rounded-full cursor-pointer block">SUBMIT</button>
        </form>
      )}

      {/* Comments */}
      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-blue-500 shadow space-y-2 rounded-lg">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-blue-500">{comment.name}:</span> {comment.comment}
            </p>
          </div>
        ))}
      </div>
      
    </main>
  );
}

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
    _id,
    slug {
    current
   }
  }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author->{
    name,
    image
   },
    'comments': *[
      _type == "comment" &&
      post._ref == ^._id &&
      approved == true],
      description,
      mainImage,
      slug,
      body
  }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if(!post){
    return {
      notFound: true
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};