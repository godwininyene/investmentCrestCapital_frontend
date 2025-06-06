import Modal from '../../components/CustomModal';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import {BiQuestionMark, BiSave, BiTrash} from 'react-icons/bi';
import { MdAddCircleOutline } from 'react-icons/md';
import axios from '../../lib/axios';
import InputField from '../../components/common/InputField';
import SubmitButton from '../../components/common/SubmitButton';
import InputError from '../../components/common/InputError';


const FaqManager = () => {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loadingPlans, setLoadOptionState] = useState(false);
  const [questionsList, loadQuestions] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState();
  const [editModal, setEditModal] = useState(false);
  const [ID, setID] = useState(null);
  const toggleID = ID=>setID(prevID=> prevID == null ? ID :null)

  useEffect(() => {
    fetchFaqs();
  }, [])

  let fetchFaqs = async () => {
    setLoadOptionState(true);
    await axios.get('api/v1/faqs')
    .then((res) => {
      setLoadOptionState(false);
      setFetched(true);
      loadQuestions(res.data.data.faqs);
    })
    .catch((err) => {
      setLoadOptionState(false);
    });
  }

  let submit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors('');
    let form = new FormData(e.target);
    await axios.post('api/v1/faqs', form)
    .then((res) => {
      setProcessing(false);
      loadQuestions(prev => [res.data.data.faq, ...prev ]);
      e.target.reset();
    })
    .catch((err) => {
      setProcessing(false);
      setErrors(err.response.data.errors);
    });
  }



  let deleteFaq = async (id) => {
    setDeleting(true);
    try {
      const response = await axios.delete(`api/v1/faqs/${id}`);
      if (response.status === 204) {
        // Update the questions state to exclude the deleted question
        loadQuestions(questions => questions.filter(el => el.id !== id));
        alert("Faq was deleted successfully!");
      }
      setDeleting(false);
    } catch (err) {
      setDeleting(false);
      if (err && !err.response) {
        alert(err);
      } else {
          alert(err.response?.data?.message)
        setErrors(err.response.data.errors);
      }
    }
  };

  return (
        <>
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 max-w-5xl">
                <aside className='col-span-2 bg-white dark:bg-slate-700 px-4 py-3 rounded-md'>
                    <h1 className="text-lg font-semibold mb-4 border-b">
                        Add New Question
                    </h1>
                    <form method="post" onSubmit={submit} encType="multipart/form-data">
                        <div className="mb-5 relative">
                            <InputField
                              name="question"
                              label="Question"
                              type="text"
                              placeholder="Enter queston"
                              isRequired={false}
                              error={errors.question}
                            />

                        </div>
                        <div className="mb-5 relative">
                          <label htmlFor="answer" className='text-sm block'> Corresponding Answer </label>
                            <textarea
                              name="answer"
                              className='w-full py-2 px-4 transition-all duration-200 focus:outline-none border border-gray-300 rounded-lg focus:border-primary-light focus:outline-0 focus:ring-0'
                            />
                          {errors.answer &&  <InputError message={errors.answer} />}
                        </div>
                        <div className="mb-5 relative">
                            <SubmitButton
                              label="Save Faq"
                              processing={processing}
                              Icon={BiSave}
                              className="w-full"
                            />
                        </div>
                    </form>
                </aside>
                <aside className='col-span-3 bg-white dark:bg-slate-700 px-4 py-1 pb-3 rounded-md'>
                  <h2 className="py-2 mb-4 border-b font-semibold flex justify-between items-center">
                      <span className="flex gap-2 items-center"> <BiQuestionMark className="w-6 h-6 inline-block" /> Frequently Asked Questions  </span>
                  </h2>
                  <div className="overflow-x-auto">
                    {/* Cards */}
                    <div className=''>
                        {
                            questionsList.map((question, i)=>(
                            <div key={question.id} className={`${i==0 ? 'border-b-0' : 'border-b'} border-b-slate-400 border-t border-t-slate-300 px-4`}>
                                <div className='py-5 relative cursor-pointer flex justify-between w-full'>
                                    <h3 className='text-xl font-bold dark:text-white flex-grow' role='button' onClick={()=>toggleID(question.id)}>{question.question}</h3>
                                    <button onClick={()=>toggleID(question.id)}>
                                    {
                                        (ID !== question.id)?(
                                            <MdAddCircleOutline className='h-8 w-8 text-primary m-auto'/>
                                        ):(
                                            <AiOutlineClose className='h-7 w-7 text-primary m-auto'/>
                                        )
                                    }
                                    </button>
                                    <button className="px-3 py-1 cursor-pointer" onClick={()=> {deleteFaq(question.id); setSelectedFaq(question)}}>
                                        {(deleting && selectedFaq.id == question.id) ? <LoadingIndicator size={8} /> : <BiTrash className='h-8 w-8 text-primary m-auto'/> }
                                    </button>
                                </div>
                                <div className={`${ID == question.id ? 'block': 'hidden'}`}>
                                    <div className='pb-5'>
                                        <p className='text-slate-500 dark:text-white'>
                                           {question.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            ))
                        }
                    </div>
                  </div>
                </aside>
              </div>
            </section>

            <Modal show={editModal} maxWidth="sm" onClose={() => setEditModal(false)} backDrop={false}>
             
            </Modal>
    </>
  )
}

export default FaqManager