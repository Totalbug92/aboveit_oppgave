import { LoaderFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';

export interface WordData {
    word: string
    phonetic: string
    phonetics: Phonetic[]
    origin: string
    meanings: Meaning[]
  }
  
  export interface Phonetic {
    text: string
    audio?: string
  }
  
  export interface Meaning {
    partOfSpeech: string
    definitions: Definition[]
  }
  
  export interface Definition {
    definition: string
    example: string
    synonyms: any[]
    antonyms: any[]
  }
  


interface LoaderData {
    wordData: WordData | null;
    error: string | null;
}

export const loader: LoaderFunction = async ({ params }) => {
    const word = params.word as string;

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) throw new Error('Word not found');

        const data = await response.json();
        const wordData = data[0];

        return Response.json({
            wordData,
            error: null
        });
    } catch (err) {
        return Response.json({
            wordData: null,
            error: err instanceof Error ? err.message : 'An error occurred'
        });
    }
};

export default function WordDisplay() {
    const { wordData, error } = useLoaderData() as LoaderData;

    return (
        <div className="p-2">
            {error && (
            <div className="card mb-6" role="alert" aria-live="assertive">
                <div className="card-content pt-6">
                <p className="text-red-500">{error}</p>
                </div>
            </div>
            )}

            {wordData && (
            <div className="pt-2">
                <h2>{wordData.word}</h2>
                <p className="text-gray-500">{wordData.origin}</p>
                <div className='flex flex-row items-center'>
                {wordData.phonetic && <p className="text-sm text-gray-500">{wordData.phonetic}</p>}
                {wordData.phonetics[0]?.audio && (
                <button onClick={() => new Audio(wordData.phonetics[0].audio).play()} className="ml-2 text-blue-500" aria-label="Play pronunciation">
                    🔊
                </button>
                )}
                </div>
                <div className="space-y-4">
                {wordData.meanings.map((meaning, index) => (
                    <div key={index} className="mb-4">
                    <h3 className="font-semibold">{meaning.partOfSpeech}</h3>
                    <ul className="list-disc list-inside">
                        {meaning.definitions.map((def, defIndex) => (
                        <li key={defIndex} className="text-sm">
                            {def.definition}
                            {def.synonyms.length > 0 && 
                            <span className="text-gray-500 ml-2">
                                Synonyms: {def.synonyms.map(syn => <Link className='underline mr-2' to={`/search/${syn}`} key={syn}>{syn}</Link>)}
                            </span>
                            }
                            {def.antonyms.length > 0 &&
                            <span className="text-gray-500 ml-2">
                                Antonyms: {def.antonyms.map(ant => <Link to={`/search/${ant}`} key={ant}>{ant} </Link>)}
                            </span>
                            }
                        </li>
                        ))}
                    </ul>
                    </div>
                ))}
                </div>
            </div>
            )}

        </div>
    );
}
