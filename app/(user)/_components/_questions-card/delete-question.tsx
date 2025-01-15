import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { toast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';

type DeleteQuestionProps = {
  questionId: string;
  username: string;
  onClose: () => void;
};

export default function DeleteQuestion({
  questionId,
  username,
}: DeleteQuestionProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setConfirmDelete(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    const response = await fetch(`/api/${username}/question/${questionId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      setLoading(false);
      toast({
        title: 'Erro ao excluir questao',
        variant: 'default',
      });
      console.error('Failed to delete question');
      return;
    }
    toast({
      title: 'Questao excluida com sucesso',
      variant: 'default',
    });
    setLoading(false);
    setConfirmDelete(false);
  };

  return (
    <>
      {!confirmDelete ? (
        <Button
          onClick={() => setConfirmDelete(true)}
          className={
            'flex items-center justify-center bg-white hover:text-red-400 sm:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200'
          }
          variant={'ghost'}
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Trash2 className="h-6 w-6  " />
          )}
        </Button>
      ) : (
        <Modal isOpen={confirmDelete} onClose={handleClose}>
          <div className="flex flex-col justify-center text-center mt-5 bg-white backdrop-blur-lg rounded-xl p-5">
            <p className="mb-6">Tem certeza que deseja excluir essa questao?</p>
            <div className="flex flex-row items-center justify-center space-x-5">
              <Button
                onClick={handleDelete}
                className="bg-[hsl(var(--main-green))] text-white mx-3"
              >
                Sim
              </Button>
              <Button
                className="bg-red-400 text-white mx-3"
                onClick={handleClose}
              >
                Não
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
