"use client";
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js'
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import Image from "next/image";

// images
import ReactChat1 from "@/public/image/projects/web/drivemond/1.png";
import ReactChat2 from "@/public/image/projects/web/drivemond/2.png";
import ProjectAll from "@/public/image/projects.png";

import Hr from "@/components/Hr";
// import ProjectCard from "./components/ProjectCard";
import Projects from "@/json/data.json";
import FixedButon from "@/components/FixedButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import PostBanner from "@/public/image/post_banner.jpg";
import FixedButton from "@/components/FixedButton";

import PostCard from "./components/PostCard"

const SUPABASE_URL = "https://xlnjnzmlrizfhwevgvkw.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, supabaseKey);

export default function Page() {
    let [posts, setPosts] = useState([]);
    useEffect(() => {
        const fecthPosts = async () => {
            let { data: personal_projects, error } = await supabase
            .from('personalsite_projects')
            .select('*')
            setPosts(personal_projects)
        }
        fecthPosts();
    }, []);
    return (
        <>
        <main className="overflow-hidden">
            <FixedButton href="/#posts">
                <FontAwesomeIcon icon={faChevronLeft} className="text-black pr-10" />
            </FixedButton>
            <div className="w-screen mx-auto container gap-4 px-10 grid grid-cols-1 md:grid-cols-1 mb-10 cursor-pointer mt-16">
                {posts.map((post, index) => <PostCard post={post} index = {index} key={index} />)}
            </div>
        </main>
        </>
    );
}
