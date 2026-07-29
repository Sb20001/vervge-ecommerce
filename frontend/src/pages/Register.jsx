import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../features/auth/authSlice';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((s) => s.auth.error);
  const status = useSelector((s) => s.auth.status);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register({ name, email, password }));
    if (register.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="font-display text-3xl text-ink">Create an account</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/60">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border border-line bg-transparent px-3 py-2.5 font-body text-sm focus:border-ink focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/60">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-line bg-transparent px-3 py-2.5 font-body text-sm focus:border-ink focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/60">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-line bg-transparent px-3 py-2.5 font-body text-sm focus:border-ink focus:outline-none"
          />
          <p className="mt-1 font-mono text-[11px] text-ink/40">At least 6 characters.</p>
        </div>

        {error && <p className="font-body text-sm text-clay">{error}</p>}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full border border-ink bg-ink py-3 font-mono text-xs uppercase tracking-widest text-paper transition hover:bg-transparent hover:text-ink disabled:opacity-50"
        >
          {status === 'loading' ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 font-body text-sm text-ink/60">
        Already have an account?{' '}
        <Link to="/login" className="text-ink underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
}
