import LinkForm from "@/components/LinkForm";
import BasicCard from "@/components/BasicCard";

export default function AddLink() {
    return (
        <div>
            <h1 className="text-5xl text-center md:text-start pb-4 ">Dashboard</h1>
            <LinkForm align="start" />
            <div className="grid grid-cols-2 gap-4 pt-12 content-center ">
                <BasicCard />
                <BasicCard />
            </div>
        </div>
    );
}
