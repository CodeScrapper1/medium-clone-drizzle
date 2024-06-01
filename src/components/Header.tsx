"use client";
import { Bell, SquarePen } from "lucide-react";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Avatar, AvatarImage } from "./ui/avatar";
import { CreateStory } from "@/actions/story";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "./ui/use-toast";
import useDebounce from "@/hooks/useDebounce";

const Header = () => {
  const { data, status }: { data: any; status: string } = useSession();
  const [search, setSearch] = useState<String>("");
  const debouncedSearch = useDebounce(search, 2000);
  const MakeNewStory = async () => {
    const response = await CreateStory();
    if (response.error) {
      toast({ title: response.error });
    }
  };
  console.log(debouncedSearch, "debouncedSearch");
  return (
    <div className="flex items-center justify-between space-x-4 py-1 px-4">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="" width={50} />
        <Input
          className="rounded-full w-60 bg-gray-100 border-none outline-none"
          placeholder="Search"
          onChange={(e: any) => setSearch(e.target.value)}
        />
      </div>
      <div className="text-gray-400 flex items-center gap-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={MakeNewStory}
        >
          <SquarePen size={25} />
          <span>Write</span>
        </div>
        <Bell size={25} />
        <Avatar>
          {data?.user ? (
            <AvatarImage
              alt="Ameer Omidvar"
              src={data?.user?.image}
              className="w-8 h-8"
            />
          ) : (
            <AvatarImage
              alt="Ameer Omidvar"
              src="/rental.webp"
              className="w-8 h-8"
            />
          )}
        </Avatar>
        {status == "authenticated" ? (
          <div
            onClick={(event) => {
              event.preventDefault();
              signOut();
            }}
            className="font-semibold text-sm cursor-pointer"
          >
            Logout
          </div>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Header;
