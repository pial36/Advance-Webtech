import Head from 'next/head';


export default function _Title(props){


    return(
        <>
            <Head>
                <title>{props.title}</title>
            </Head>
        
        </>
    )
}