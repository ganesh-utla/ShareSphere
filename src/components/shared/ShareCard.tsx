import { Models } from 'appwrite';
import { useState } from 'react'
import { Link } from 'react-router-dom';


type ShareCardProps = {
    post: Models.Document;
    share: boolean;
    setShare:  React.Dispatch<React.SetStateAction<boolean>>
}

const ShareCard = ({ post, share, setShare } : ShareCardProps) => {

    const [linkCopied, setLinkCopied] = useState(false);

    const url = `https://share-sphere.vercel.app/posts/${post.$id}`;
    const message = `Hey%2C%20Check%20out%20this%20post%3A%0A${url}`;

  return (
    <>
    {
        share && 
        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black bg-opacity-50 px-2">
            <div className="relative my-6 mx-auto w-[800px] max-w-3xl ">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-light-2 outline-none focus:outline-none">
                    <div className='p-5'>
                        <div className='flex justify-end pb-2'>
                            <p className='text-light-4 base-regular cursor-pointer' 
                                onClick={() => setShare(false)}
                            >
                                Close
                            </p>
                        </div>
                        <h3 className='h3-bold'>Share Post</h3>
                        <div className='mt-3 relative flex max-xs:flex-col gap-5 justify-center items-center bg-light-6 border border-light-7 text-dark-3 p-3 rounded-md max-h-40 overflow-auto'>
                            <div className='break-all'>{url}</div>
                            <div className='max-xs:w-full flex justify-center items-center px-2 h-8 bg-primary-500 rounded-md cursor-pointer'
                                onClick={() => {
                                    setLinkCopied(true);
                                    navigator.clipboard.writeText(url);
                                    setTimeout(() => setLinkCopied(false), 3000);
                                }}
                            >
                                <img
                                    src={`/assets/icons/${linkCopied? "tick" : "link"}.svg`}
                                    alt="link"
                                    width={17}
                                    height={17}
                                    className={`object-contain ${!linkCopied && "invert-white"}`}
                                />
                            </div>
                        </div>
                        <div className='mt-3 flex w-full items-center justify-center'>
                            <div className='border border-light-3 w-3/12 h-0'/>
                            <div className='text-light-4 mx-4 text-center'>
                                <p>Share via Media</p>
                            </div>
                            <div className='border border-light-3 w-3/12 h-0'/>
                        </div>
                        <div className='mt-3 p-3 rounded-md'>
                            <div className='flex justify-center items-center gap-5'>
                                <Link to={`whatsapp://send?text=${message}`} target='_blank'>
                                    <img
                                        src="/assets/icons/whatsapp.svg" alt="share" width={40} height={40} 
                                        className='cursor-pointer object-contain bg-white rounded-md'
                                    />
                                </Link>
                                <Link to={`https://x.com/intent/tweet?url=${url}`} target='_blank'>
                                    <img
                                        src="/assets/icons/twitterx.svg" alt="share" width={40} height={40} 
                                        className='cursor-pointer object-contain bg-white rounded-md'
                                    />
                                </Link>
                                <Link to={`https://www.facebook.com/sharer.php?u=${url}`} target='_blank'>
                                    <img
                                        src="/assets/icons/facebook.svg" alt="share" width={40} height={40} 
                                        className='cursor-pointer object-contain bg-white rounded-md'
                                    />
                                </Link>
                                <Link to={`https://www.linkedin.com/shareArticle?mini=true&url=${url}`} target='_blank'>
                                    <img
                                        src="/assets/icons/linkedin.svg" alt="share" width={40} height={40} 
                                        className='cursor-pointer object-contain bg-white rounded-lg'
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
    </>
  )
}


export default ShareCard;