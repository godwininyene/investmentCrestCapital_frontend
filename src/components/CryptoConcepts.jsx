import { Link } from "react-router-dom";

const CryptoConcepts = () => {
  const concepts = [
    {
      number: "01.",
      title: "Blockchain Technology",
      desc: "Blockchain is a decentralized ledger that records all transactions across a network of computers, ensuring transparency, security, and immutability.",
    },
    {
      number: "02.",
      title: "Cryptocurrency & Digital Assets",
      desc: "Cryptocurrency is a digital currency secured by cryptography, enabling peer-to-peer transactions without intermediaries like banks. Examples include Bitcoin and Ethereum.",
    },
    {
      number: "03.",
      title: "Smart Contracts",
      desc: "Smart contracts are self-executing agreements with the terms written directly into code, automating processes and eliminating the need for intermediaries.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {concepts.map((concept, index) => (
          <div key={index} data-aos="fade-up" className="text-gray-700">
            <span className="text-6xl font-bold text-gray-300">{concept.number}</span>
            <p className="text-sm italic text-gray-500">Crypto Insight</p>
            <h3 className="text-lg font-semibold text-gray-900">{concept.title}</h3>
            <p className="mt-2 text-gray-600">{concept.desc}</p>
            <Link to="#" className="text-yellow-500 font-medium mt-3 inline-block">
              + Read More
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CryptoConcepts;
