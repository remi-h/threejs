'use client';

export default function Note() {
    return (
        <main>
            <div className="m-auto max-w-4xl bg-gray-100 p-4">
                <h1 className="text-4xl">Note</h1>
                <ol className="list-decimal mx-8">
                    <li>user input a keyword</li>
                    <li>keyword becomes a vector</li>
                    <li>keyword is the center</li>
                    <li>calculate cosine similarity</li>
                </ol>
            </div>
        </main>
    );
}
