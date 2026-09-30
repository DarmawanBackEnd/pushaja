import { redirect } from 'next/navigation';

export default function FreelancerApplyFormRedirect() {
  redirect('/freelancer/apply?tab=form');
}
