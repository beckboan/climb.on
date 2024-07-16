"use client";
import Image from "next/image";
import styles from "./page.module.css";
import NavBar from "./components/NavBar";
import { UrqlProvider } from "@urql/next";
import { createUrqlClient } from "@/utils/createUrqlClient";

export default function Home() {
  return (
    <>
      <NavBar />
      <h1> Hello world</h1>
    </>
  );
}
